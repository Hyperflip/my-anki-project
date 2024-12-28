// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from "path-browserify";

declare global {
    interface Window {
        api? : any
    }
}

export class PathService {
    private isReactBuild: boolean = false;
    private isElectronEnv: boolean = false;

    private root: string = "/";

    constructor() {
        // determine isReactBuild & isElectronEnv
        if (window.api && window.api.IS_ELECTRON_ENV) {
            this.isElectronEnv = true;
        }
        if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
            this.isReactBuild = true;
        }
        this.buildRoot();
    }

    private buildRoot() {
        if (this.isElectronEnv && this.isReactBuild) {
            this.root = path.join(window.api.ELECTRON_DIRNAME, "public");
        }
    }

    // return correct root ("/" in case of web, file system in case of react build)
    public getRoot(): string {
        return this.root!;
    }

    public getResourcePath(resource: string) {
        return path.join(this.root, resource);
    }
}
