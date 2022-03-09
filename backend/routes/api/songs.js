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
    console.log('..............................')
    const currUser = req.user.dataValues.id;
    const form = new formidable.IncomingForm();
    console.log('......', form)
    await form.parse(req, async(err, fields, files) => {
        await fs.readFile(files.audioFile.filepath, async(err, data) => {
            const params = {
                Bucket: bucketName,
                Key: `${files.audioFile.newFilename}-${files.audioFile.originalFilename}`,
                Body: data
            }
            await s3.upload(params, async(err, data) => {
                let insertSong = await Song.create({
                    name: fields.songTitle,
                    song_url: data.Location,
                    genre: {"aqustic": "true"},
                    user_id: currUser,
                    album_id: 1
                })
                res.json({insertSong})
            })
        })
    })

}))

router.get('/', requireAuth, asyncHandler(async(req, res) => {
    const loadSongs = await Song.findAll();
    res.json(loadSongs)
}))

module.exports = router;
