import { TiptapTransformer } from '@hocuspocus/transformer';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import { generateHTML, generateJSON } from '@tiptap/html';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Dropcursor from '@tiptap/extension-dropcursor';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

const extensions = [
    TextAlign,
    Underline,
    Table,
    TableRow,
    TableCell,
    TableHeader,
    Document,
    Paragraph,
    Text,
    Heading,
    Bold,
    Italic,
    Blockquote,
    BulletList,
    OrderedList,
    ListItem,
    Image,
    CodeBlock,
    HardBreak,
    TaskItem,
    TaskList,
    Color,
    Placeholder,
    FontFamily,
    Link,
    TextStyle,
    Highlight,
    Dropcursor,
    HorizontalRule
];

export function jsonFromYDoc(document, fieldName = "default") {
    return TiptapTransformer.fromYdoc(document, fieldName);
}

export function jsonToYDoc(json, fieldName = "default") {
    return TiptapTransformer.toYdoc(json, fieldName, extensions);
}

export function htmlToJson(html) {
    return generateJSON(html, extensions);
}

export function jsonToHTML(json) {
    return generateHTML(json, extensions);
}
