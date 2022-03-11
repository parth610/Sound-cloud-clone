const express = require('express');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3')
const formidable = require('formidable');

const {Album} = require('../../db/models');
const {awsKeys} = require('../../config');
const { requireAuth } = require('../../utils/auth');
const {accessKey, secretKey, region, bucketName} = awsKeys;

const s3 = new S3({
    accessKey,
    secretKey,
    region
})

const router = express.Router();

router.post('/', requireAuth, asyncHandler(async(req,res) => {
    const currUser = req.user.dataValues;
    const form = new formidable.IncomingForm();
    await form.parse(req, async(err, fields, files) => {
        if (Object.keys(files).length > 0) {
            await fs.readFile(files.albumPoster.filepath, async(err, data) => {
                const filenameExtension = files.albumPoster.originalFilename.split('.');
                const extension = filenameExtension[filenameExtension.length - 1];
                const params = {
                    Bucket: bucketName,
                    Key: `posters/${fields.albumTitle}-${currUser.username}.${extension}`,
                    Body: data
                }
                await s3.upload(params, async(err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        const insertAlbum = await Album.create({
                            name: fields.albumTitle,
                            image_url: data.Location,
                            user_id: currUser.id
                        })
                        res.json({insertAlbum})
                    }
                })
            })
        } else {
            const insertAlbum = await Album.create({
                name: fields.albumTitle,
                image_url: 'no-image',
                user_id: currUser.id
            })
            res.json({insertAlbum})
        }
    })
}))

router.get('/', requireAuth, asyncHandler(async(req, res) => {
    const loadAlbums = await Album.findAll();
    res.json(loadAlbums)
}))

router.delete('/:albumId', requireAuth, asyncHandler(async(req, res) => {
    const albumId = req.params.albumId;
    const currUser = req.user.dataValues;
    const deleteAlbum = await Album.findByPk(+albumId);
    if (deleteAlbum.image_url === 'no-image' || deleteAlbum.image_url === 'empty') {
        await deleteAlbum.destroy();
        res.json(deleteAlbum);
    } else {
        const linkExtension = deleteAlbum.image_url.split('.');
        const extension = linkExtension[linkExtension.length - 1];
        const oldKey = `posters/${deleteAlbum.name}-${currUser.username}.${extension}`
        await deleteAlbum.destroy();
        const deleteParams = {
            Bucket: bucketName,
            Key: oldKey
        }
        await s3.deleteObject(deleteParams, (err, data) => {
            return res.json(deleteAlbum)
        })
    }
}))

module.exports = router;
