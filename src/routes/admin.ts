import { Router } from 'express';
import * as auth from '../controllers/auth';
import * as events from '../controllers/events';
import * as groups from '../controllers/groups';
import * as people from '../controllers/people';

export const router = Router();

router.post('/login', auth.login);
router.get('/ping', auth.ping);

router.post('/events', auth.validade, events.create);
router.get('/events', auth.validade, events.getAll);
router.get('/events/:id', auth.validade, events.getEvent);
router.put('/events/:id', auth.validade, events.update);
router.delete('/events/:id', auth.validade, events.remove);

router.post('/events/:event_id/groups', auth.validade, groups.create);
router.get('/events/:event_id/groups', auth.validade, groups.getAll);
router.get('/events/:event_id/groups/:id', auth.validade, groups.getGroup);
router.put('/events/:event_id/groups/:id', auth.validade, groups.update);
router.delete('/events/:event_id/groups/:id', auth.validade, groups.remove);

router.post('/events/:event_id/groups/:group_id/people', auth.validade, people.create);
router.get('/events/:event_id/groups/:group_id/people', auth.validade, people.getAll);
router.get('/events/:event_id/groups/:group_id/people/:id', auth.validade, people.getPerson);
router.put('/events/:event_id/groups/:group_id/people/:id', auth.validade, people.update);
router.delete('/events/:event_id/groups/:group_id/people/:id', auth.validade, people.remove);