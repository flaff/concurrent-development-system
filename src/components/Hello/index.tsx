import * as React from 'react';
import './styles.css';
import Messages, {MessageModel} from '@components/Messages';
import mock = jest.mock;

export interface Props {
    name: string;
    enthusiasmLevel?: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

const mockMessages: Array<MessageModel> = [
    {author: 'someone', content: 'Lorem ipsum'},
    {author: 'someone', content: 'dolor sit amet'},
    {author: 'someone', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

    {author: 'me', content: 'Mauris dictum'},

    {author: 'someoneElse', content: 'dolor sit amet'},
    {author: 'someoneElse', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

    {author: 'me', content: 'Lorem ipsum'},
    {author: 'me', content: 'dolor sit amet'},
    {author: 'me', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

];

function Hello({name, enthusiasmLevel = 1, onIncrement, onDecrement}: Props) {
    if (enthusiasmLevel <= 0) {
        throw new Error('You could be a little more enthusiastic. :D');
    }

    return (
        <div className="hello">
            <div className="greeting">
                Hello {name + getExclamationMarks(enthusiasmLevel)}
            </div>
            <div>
                <button onClick={onDecrement}>-</button>
                <button onClick={onIncrement}>+</button>
            </div>
            <Messages messages={mockMessages} user={'me'} />
        </div>
    );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}
