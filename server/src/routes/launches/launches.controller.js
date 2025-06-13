const { 
    getAllLaunches, 
    scheduleNewLaunch, 
    existsLaunchWithId, 
    abortLaunchById 
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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

    await scheduleNewLaunch(launch);
    console.log('launch: ', launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);

    if (!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    } else {
        const aborted = await abortLaunchById(launchId);
        if (!aborted) {
            return res.status(400).json({ error: 'Launch not aborted' });
        }
        
        return res.status(200).json({ acknowledged: true });
    }
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}