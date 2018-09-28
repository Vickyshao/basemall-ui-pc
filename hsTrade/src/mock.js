const express = require('express')
const router = express.Router()
const Mock = require('mockjs')
var Random = mock.Random
router.get('/data', (req, res) => {
	const mockData = {
		email: Random.email()
	}
	res.json(mockData);
})
module.export = router;