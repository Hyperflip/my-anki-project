import ButtonPrimary from "./ButtonPrimary";
import { useEffect, useState } from "react";


function GoogleDriveHandler({ handleFilePicked }: { handleFilePicked: (blob: any) => void }) {
    const [tokenClient, setTokenClient] = useState<any>();
    const [accessToken, setAccessToken] = useState<string>();
    const [file, setFile] = useState({}) as any;
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const clientId = process.env.REACT_APP_OAUTH2_CLIENT_ID!;
    const developerKey = process.env.REACT_APP_API_KEY!;
    const appId = process.env.REACT_APP_APP_ID!;

    let pickerInited = false;
    let gisInited = false;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        script.onload = onApiLoad;

        const script2 = document.createElement("script");
        script2.src = "https://accounts.google.com/gsi/client";
        script2.async = true;
        script2.defer = true;
        script2.onload = gisLoaded;

        document.body.appendChild(script);
        document.body.appendChild(script2);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(script2);
        };
    }, []);

    useEffect(() => {
        if (file && accessToken) {
            fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch file');
                    return response.blob(); // or response.text(), depending on file type
                })
                .then(blob => {
                    handleFilePicked(blob);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [file]);

    function onApiLoad() {
        gapi.load('picker', onPickerApiLoad);
    }

    function onPickerApiLoad() {
        pickerInited = true;
    }

    function gisLoaded() {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/drive.file',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            callback: () => {}
        });
        setTokenClient(tokenClient);
        gisInited = true;
    }

    function createPicker() {
        const showPicker = () => {
            const picker = new google.picker.PickerBuilder()
                .addView(google.picker.ViewId.DOCS)
                .setOAuthToken(accessToken!)
                .setDeveloperKey(developerKey)
                .setCallback((data) => setFile(data))
                .setAppId(appId)
                .build();
            picker.setVisible(true);
        };

        tokenClient.callback = async (response: any) => {
            if (response.error !== undefined) {
                throw (response);
            }
            setAccessToken(response.access_token);
            showPicker();
        };

        if (accessToken === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
    }

    function handleOpenPicker() {
        createPicker();
    }

    return (<div>
        <ButtonPrimary text="Open Picker" onClick={handleOpenPicker}/>
    </div>);
}

export default GoogleDriveHandler;
