'use strict';

var en = {
    "locales": "en-EN",
    "messages": {
        "photos": "On {takenDate, date, long}, {name} {numPhotos, plural,\n  =0 {did not took any picture.}\n  =1 {took a picture.}\n  other {took # pictures.}\n}\n",
        "test":"english"
    },
    "formats": {
        "date": {
            "custom": {
                "day": "numeric",
                "month": "long",
                "year": "numeric"
            }
        }
    }
};

export default en;