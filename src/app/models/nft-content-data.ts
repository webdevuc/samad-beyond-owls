export enum NFTContentType {
    Image = 1,
    Video = 2,
    Gif = 3
}

export class NFTContentData {
    contentType: NFTContentType;
    contentPath: string;
    availableForSale: boolean;
    nftObj: any;
    src: string;
}