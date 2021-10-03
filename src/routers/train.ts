import expres from 'express';

const trainRouter = expres.Router();

// partial implementation
trainRouter.get('/timetable/:id', async (req, res) => {
  res.sendStatus(404);
});

export default trainRouter;
