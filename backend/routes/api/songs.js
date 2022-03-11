const express = require('express')
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3')
const path = require('path');
const formidable = require('formidable');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const {Song} = require('../../db/models');
const {awsKeys} = require('../../config')
const {accessKey, secretKey, region, bucketName} = awsKeys;


const s3 = new S3({
    accessKey,
    secretKey,
    region
})

const router = express.Router();

router.post('/', requireAuth, asyncHandler(async(req, res, next) => {
    const currUser = req.user.dataValues;
    const form = new formidable.IncomingForm();
    await form.parse(req, async(err, fields, files) => {
        await fs.readFile(files.audioFile.filepath, async(err, data) => {
            const filenameExtension = files.audioFile.originalFilename;
            const extension = filenameExtension.split('.')[1]
            const params = {
                Bucket: bucketName,
                Key: `${fields.songTitle}-${currUser.username}.${extension}`,
                Body: data
            }
            await s3.upload(params, async(err, data) => {
                let insertSong = await Song.create({
                    name: fields.songTitle,
                    song_url: data.Location,
                    genre: {"aqustic": "true"},
                    user_id: currUser.id,
                    album_id: 1
                })
                res.json({insertSong})
            })
        })
    })

}));

router.get('/', requireAuth, asyncHandler(async(req, res) => {
    const loadSongs = await Song.findAll();
    res.json(loadSongs)
}));

router.put('/:songId', requireAuth, asyncHandler(async(req, res) => {
    const {updateTitle} = req.body;
    const currUser = req.user.dataValues;
    const songId = req.params.songId;
    const editedSong = await Song.findByPk(+songId);
    const linkExtension = editedSong.song_url.split('.');
    const extension = linkExtension[linkExtension.length - 1];
    const oldKey = `${editedSong.name}-${currUser.username}.${extension}`
    const newKey =  `${updateTitle}-${currUser.username}.${extension}`
    const copyParams = {
        Bucket: bucketName,
        Key: newKey,
        CopySource: `${bucketName}/${oldKey}`
    }
    await s3.copyObject(copyParams, async (err, data) => {
        if (err) {
            
        } else {
            editedSong.name = updateTitle;
            editedSong.song_url = `https://sound-core.s3.us-west-1.amazonaws.com/${newKey}`
            await editedSong.save();
            res.json(editedSong)
        }
    })

    const deleteParams = {
        Bucket: bucketName,
        Key: oldKey
    }

    await s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
            console.log(err)
        }
    })
}))

router.delete('/:songId', requireAuth, asyncHandler(async(req, res) => {
    const currUser = req.user.dataValues;
    const songId = req.params.songId;
    const deleteSong = await Song.findByPk(+songId);
    const linkExtension = deleteSong.song_url.split('.');
    const extension = linkExtension[linkExtension.length - 1];
    const oldKey = `${deleteSong.name}-${currUser.username}.${extension}`
    await deleteSong.destroy();
    const deleteParams = {
        Bucket: bucketName,
        Key: oldKey
    }
    await s3.deleteObject(deleteParams, (err, data) => {
        return res.json(deleteSong)
    })
}))

module.exports = router;
