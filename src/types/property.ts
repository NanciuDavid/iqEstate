export interface Property{
    id : string;
    title : string;
    price : number;
    pricePerSqft? : number; // will be computed
    surface : number;
    bedrooms : number;
    bathrooms : number;
    address : string;
    description? : string; // optional
    images : string[]; // s3 urls 
    latitude? : number; // computed based on location
    longitude? : number; // computed based on location
    type: string; // apartment, house, land, etc
    status?: string;
    tags: string[];
    featured?: boolean;
    newListing? : boolean; // computed based on listing date
    yearBuilt : number;
    listedDate? : string;
    predictedPrice? : number; // computed based on price history

    ownerId : string;
    ownerName : string;
    ownerEmail : string;
    ownerPhone : string;
    
}