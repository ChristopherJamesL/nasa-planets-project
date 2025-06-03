const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (
        !launch.launchDate ||
        !launch.mission ||
        !launch.rocket ||
        !launch.target
    ) {
        return res.status(400).json({
            error: `Missing required launch property`
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }

    if (launch.launchDate <= new Date()) {
        return res.status(400).json({
            error: 'Launch date must be in the future'
        })
    }

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}