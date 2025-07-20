import useDrivePicker from "react-google-drive-picker";
import ButtonPrimary from "./ButtonPrimary";
import { useEffect, useState } from "react";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";


function GoogleDriveHandler({ handleFilePicked }: { handleFilePicked: (blob: any) => void }) {
    const [openPicker, authResponse] = useDrivePicker();
    const [file, setFile] = useState({}) as any;
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const clientId = process.env.REACT_APP_OAUTH2_CLIENT_ID!;
    const developerKey = process.env.REACT_APP_API_KEY!;

    useEffect(() => {
        if (file && authResponse?.access_token) {
            fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authResponse.access_token}`,
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

    const handleOpenPicker = () => {
        openPicker({
            clientId: clientId,
            developerKey: developerKey,
            viewId: "DOCS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                }
                if (data.docs) {
                    setFile(data.docs[0]);
                }
            },
        });
    };

    return (<div>
        <ButtonPrimary text="Open Picker" onClick={handleOpenPicker}/>
    </div>);
}

export default GoogleDriveHandler;
