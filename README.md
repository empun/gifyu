# GIFYU :framed_picture:
Unofficial API of [gifyu.com](https://gifyu.com). Free hosting for images 🚀. <br>
[![npm version](https://badge.fury.io/js/gifyu.svg)](https://badge.fury.io/js/gifyu)

## Get Started 
- Install Gifyu
```bash 
npm install gifyu
```

- Import Gifyu
```javascript
const { gifyu }  = require('gifyu') 
// or
import { gifyu } from 'gifyu' 
```

## Usage

```javascript
gifyu(file/link, album) // album is optional
    .then(res => console.log(res));
```

- **Using File Path**
```javascript
gifyu('example/example_one.jpg')
    .then(res => console.log(res));
```

- **Using File Path + Title & Description**
```javascript
gifyu({
    source: 'example/example_one.jpg',
    filename: 'My Photo', // optional , default ''
    description: 'A Photo Got from LoremPicsum' // optional , default ''
})
.then(res => console.log(res));
```

- **Using File Path + Create Album**
```javascript
gifyu('example/example_one.jpg', {
    title: 'My First Album', // mandatory
    description: 'Album about nothing', // optional , default ''
    privacy: 'private_but_link' // optional, default 'private_but_link'
})
.then(res => console.log(res));
```
Note 🚀 : <br> `privacy` is optional, either `'public'` or `'private_but_link'` or `'password'`. 
- `public` : anyone can access your album
- `private_but_link` : anyone can't access unless you give them the link
- `password` : anyone can't access unless you give them the password

if you choose `'password'` you have to provide additional field `'password'`.
```javascript
{
    title: 'My First Album', 
    description: 'Album about nothing',
    privacy: 'password', // you choose password
    password: 'hello123pass' // then add this field
}
```

- **Multiple File Path**
```javascript
gifyu([
    'example/example_one.jpg', 
    'example/example_two.jpg'
])
.then(res => console.log(res));
```

- **Multiple File Path + Title & Description + Create Album**
```javascript
gifyu(
 [
    {
        source: 'example/example_one.jpg',
        filename: 'My Photo 1', // optional , default ''
        description: 'A Photo Got from LoremPicsum' // optional , default ''
    },
    {
        source: 'example/example_two.jpg',
        filename: 'My Photo 2',
        description: 'A Photo Got from LoremPicsum' // optional , default ''
    }
 ],
    {
        title: 'My First Album', 
        description: 'This is description', 
        privacy: 'private_but_link' 
    }
)
.then(res => console.log(res));
```

- **Using Link**
```javascript
gifyu('https://picsum.photos/id/1/200/300')
    .then(res => console.log(res));
```

- **Using Link + Title & Description**
```javascript
gifyu({
    source: 'https://picsum.photos/id/1/200/300',
    filename: 'Example Link with Title & Description', // optional , default ''
    description: 'This image is taken from LoremPhotos' // optional , default ''
}).then(res => console.log(res));
```

- **Multiple Links and Paths**
```javascript
gifyu([
    'example/example_one.jpg', 
    'https://picsum.photos/id/1/200/300',
    'example/example_two.jpg'
]).then(res => console.log(res));
```

- **Multiple Links and Paths + Create Album**
```javascript
gifyu(
    [
        'example/example_one.jpg', 
        'https://picsum.photos/id/1/200/300'
    ],
    {
        title: 'My First Album' // mandatory
    }
).then(res => console.log(res));
```

- **Example Response**
```json
{
    "status_code": 200,
    "success": {
        "message": "image uploaded",
        "code": 200
    },
    "image": {
        "name": "example_one66c008e5f4006540",
        "extension": "jpg",
        "size": 6266,
        "width": "200",
        "height": "300",
        "date": "2021-09-21 03:24:18",
        "date_gmt": "2021-09-21 02:24:18",
        "description": null,
        "nsfw": "1",
        "storage_mode": "direct",
        "md5": "006d04cd82d6ca661cd4adc6932f48b6",
        "original_filename": "example_one.jpg",
        "original_exifdata": "{\"FileName\":\"example_one.jpg\",\"FileDateTime\":\"1632191057\",\"FileSize\":\"6266\",\"FileType\":\"2\",\"MimeType\":\"image\\/jpeg\",\"SectionsFound\":\"ANY_TAG, IFD0, EXIF\",\"COMPUTED\":{\"html\":\"width=\\\"200\\\" height=\\\"300\\\"\",\"Height\":\"300\",\"Width\":\"200\",\"IsColor\":\"1\",\"ByteOrderMotorola\":\"0\",\"UserComment\":\"Picsum ID: 866\",\"UserCommentEncoding\":\"ASCII\"},\"Orientation\":\"1\",\"XResolution\":\"72\\/1\",\"YResolution\":\"72\\/1\",\"ResolutionUnit\":\"2\",\"YCbCrPositioning\":\"1\",\"Exif_IFD_Pointer\":\"102\",\"ExifVersion\":\"0210\",\"ComponentsConfiguration\":\"\\u0001\\u0002\\u0003\\u0000\",\"UserComment\":\"ASCII\\u0000\\u0000\\u0000Picsum ID: 866\",\"FlashPixVersion\":\"0100\",\"ColorSpace\":\"65535\",\"ExifImageWidth\":\"200\",\"ExifImageLength\":\"300\"}",
        "views": "0",
        "category_id": null,
        "chain": "5",
        "thumb_size": "6536",
        "medium_size": "0",
        "title": "example one",
        "expiration_date_gmt": "2022-09-21 02:24:17",
        "likes": "0",
        "is_animated": "0",
        "source_md5": null,
        "is_approved": "1",
        "is_360": "0",
        "file": {
            "resource": {
                "type": "url"
            }
        },
        "id_encoded": "PuBy",
        "filename": "example_one66c008e5f4006540.jpg",
        "mime": "image/jpeg",
        "url": "https://s9.gifyu.com/images/example_one66c008e5f4006540.jpg",
        "ratio": 0.6666666666666666,
        "size_formatted": "6.3 KB",
        "url_viewer": "https://gifyu.com/image/PuBy",
        "url_short": "https://gifyu.com/image/PuBy",
        "image": {
            "filename": "example_one66c008e5f4006540.jpg",
            "name": "example_one66c008e5f4006540",
            "mime": "image/jpeg",
            "extension": "jpg",
            "url": "https://s9.gifyu.com/images/example_one66c008e5f4006540.jpg",
            "size": 6266
        },
        "thumb": {
            "filename": "example_one66c008e5f4006540.th.jpg",
            "name": "example_one66c008e5f4006540.th",
            "mime": "image/jpeg",
            "extension": "jpg",
            "url": "https://s9.gifyu.com/images/example_one66c008e5f4006540.th.jpg",
            "size": "6536"
        },
        "display_url": "https://s9.gifyu.com/images/example_one66c008e5f4006540.jpg",
        "display_width": "200",
        "display_height": "300",
        "views_label": "views",
        "likes_label": "likes",
        "how_long_ago": "moments ago",
        "date_fixed_peer": "2021-09-21 02:24:18",
        "title_truncated": "example one",
        "title_truncated_html": "example one",
        "is_use_loader": false
    },
    "request": {
        "nsfw": 1,
        "action": "upload",
        "expiration": "0",
        "timestamp": "1632191056328",
        "type": "file",
        "auth_token": "YOUR AUTH_TOKEN SHOULD BE HERE",
        "cookie": "YOUR COOKIE SHOULD BE HERE TOO"
    },
    "status_txt": "OK"
}
```