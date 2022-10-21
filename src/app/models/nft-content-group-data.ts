import { NFTContentData } from "./nft-content-data";

export enum NFTContentGroup {
    Mythic = 1,
    Rare = 2,
    Legendary = 3,
    Common = 4,
    key = 0,
}

export class NFTContentGroupData {
    id: number;
    contentGroup: NFTContentGroup;
    contentHeader: string;
    contentData: NFTContentData[];
}

export class NftObjData {
    _id: string;
    assetName: string;
    availableForSale: boolean;
    amount: string;
    owned_by: string;
    quantity: string;
    userNftId: string;
    ownerAddr: string;
    metadata: any;
    assetKey: string;
    imageUrl: string;
    imageLink: string;
}

class userNftData {
    _id: string;
    amount: number;
    userNftId: string;
    userId: string;
}

export class BuyNftObjData {
    _id: string;
    assetName: string;
    // availableForSale: boolean;
    // amount: string;
    // owned_by: string;
    // quantity: string;
    // userNftId: string;
    // ownerAddr: string;
    userNftData: userNftData
}