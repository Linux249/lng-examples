import {Asset, Detail} from "./models";
const apiKey = `66683917a94e703e14ca150023f4ea7c`;
let stage;

export const init = (stageInstance) =>{
    stage = stageInstance;
};

export const getPopular = async(type)=> {
    if(!type){
        throw new Error("no type defined")
    }

    const assets = await get(`https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}`);
    const {results = []} = assets;

    if(results.length){
        return results.map((data)=>{
            const asset = new Asset(data);
            asset.type = type;

            return asset;
        });
    }
    return [];
};

export const getDetails = (type, id)=> {
    return get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`).then(response => {
        return new Detail(response);
    });
};

const get = (url)=> {
    return fetch(url, {
        'Accept': 'application/json'
    }).then(response => {
        return response.json();
    })
};

