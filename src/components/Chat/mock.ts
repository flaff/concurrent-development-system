import {MessageModel} from '@components/Chat/Messages';
import * as moment from 'moment';

const mockMessages: Array<MessageModel> = [
    {author: 'someone', content: 'Lorem ipsum', time: +moment('12:30', 'HH:mm')},
    {author: 'someone', content: 'dolor sit amet', time: +moment('12:31', 'HH:mm')},
    {author: 'someone', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.', time: +moment('12:32', 'HH:mm')},

    {author: 'me', content: 'Mauris dictum', time: +moment('12:33', 'HH:mm')},

    {author: 'flaff', content: 'dolor sit amet', time: +moment('12:34', 'HH:mm')},
    {author: 'flaff', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.', time: +moment('12:35', 'HH:mm')},

    {author: 'me', content: 'Lorem ipsum', time: +moment('12:36', 'HH:mm')},
    {author: 'me', content: 'dolor sit amet', time: +moment('12:37', 'HH:mm')},
    {author: 'me', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.', time: +moment('12:38', 'HH:mm')},

];

export default mockMessages;
