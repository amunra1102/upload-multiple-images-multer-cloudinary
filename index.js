const express = require('express');
const fs = require('fs');

const app = express();

const cloudinary = require('./cloudinary');
const upload = require('./multer');

app.use(express.json());

app.use('/upload-images', upload.array('image'), async (req, res) => {
  const uploader = async path => await cloudinary.uploads(path, 'images');

  if (req.method === 'POST') {
    const urls = [];
    const { files } = req;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);

      fs.unlinkSync(path);
    }

    res.status(200).json({
      message: 'Images uploaded success'
    });
  } else {
    res.status(405).json({
      message: 'Images not uploaded success'
    });
  }
});

app.listen(8888, () => console.log('Server is listening on port 8888'));
