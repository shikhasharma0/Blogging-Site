const express = require('express');
const router = express.Router();

router.get('/test',function (req, res) 
{
    res.send('Project 1 Blogging Site (Group-38)');
});

module.exports = router;