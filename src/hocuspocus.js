import { Server } from "@hocuspocus/server";
import { Logger } from '@hocuspocus/extension-logger';
import { Socket } from 'net';
import { htmlToJson, jsonToYDoc } from './service/transformer.js';
// import { getPageContent, updatePage } from "./service/api";
import { Doc } from "yjs";
// import { getDocHtml } from '.';
import { ServerBlockNoteEditor } from "@blocknote/server-util";
const sockets = {};

export const server = Server.configure({
    name: "doc-rtc",
    port: 1234,
    timeout: 30000,
    debounce: 500,
    maxDebounce: 1000,
    quiet: true,
    extensions: [
        new Logger()
    ],
    async onConnect(data){
        sockets[data.socketId] = data.request.socket;
        console.log("onConnect");
    },
    async onLoadDocument(data) {
        console.log("onLoadDocument");
        const page = data.documentName;
        const org = data.context?.orgId;
        if (!data.document.isEmpty("default")) {
            data.context.error = false;
            return;
        }
        try {
            const htmlDoc = `<div class=\"bn-block-group\" data-node-type=\"blockGroup\"><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"90af52e2-09d6-4a92-8916-c30a08c7d572\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"90af52e2-09d6-4a92-8916-c30a08c7d572\"><div class=\"bn-block-content\" data-content-type=\"codeBlock\"><pre><code class=\"bn-inline-content language-javascript\">const function () =&gt; {<br>console.log(\"hello world\")<br>}</code></pre></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"2cd7cb96-56b1-4c16-a72e-d29ac2f93764\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"2cd7cb96-56b1-4c16-a72e-d29ac2f93764\"><div class=\"bn-block-content\" data-content-type=\"paragraph\"><p class=\"bn-inline-content\"></p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"a982b0f5-25eb-4a40-8db8-206e2ff70a2a\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"a982b0f5-25eb-4a40-8db8-206e2ff70a2a\"><div class=\"bn-block-content\" data-content-type=\"table\"><table class=\"bn-inline-content\"><tr><td colspan=\"1\" rowspan=\"1\"><p>Prince </p></td><td colspan=\"1\" rowspan=\"1\"><p>Kumar</p></td><td colspan=\"1\" rowspan=\"1\"><p>Darbanga</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>Goutam </p></td><td colspan=\"1\" rowspan=\"1\"><p>Mehta</p></td><td colspan=\"1\" rowspan=\"1\"><p>Jaora</p></td></tr></table></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"43b05f4d-7fd3-41f9-9db8-6080f7499e81\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"43b05f4d-7fd3-41f9-9db8-6080f7499e81\"><div class=\"bn-block-content\" data-content-type=\"numberedListItem\" data-index=\"1\"><p class=\"bn-inline-content\">List 1</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"3d4a7fa2-2eed-4056-adb1-0efe0aa50d12\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"3d4a7fa2-2eed-4056-adb1-0efe0aa50d12\"><div class=\"bn-block-content\" data-content-type=\"numberedListItem\" data-index=\"2\"><p class=\"bn-inline-content\">List 2</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"35d5228a-f938-4e47-a8a9-500378fe18b0\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"35d5228a-f938-4e47-a8a9-500378fe18b0\"><div class=\"bn-block-content\" data-content-type=\"numberedListItem\" data-index=\"3\"><p class=\"bn-inline-content\">List 3</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"ed7c56a3-b56f-43e6-8ffb-fc812e039621\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"ed7c56a3-b56f-43e6-8ffb-fc812e039621\"><div class=\"bn-block-content\" data-content-type=\"checkListItem\"><input type=\"checkbox\"><p class=\"bn-inline-content\">Todo 1</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"8a355f08-644f-4600-a040-dabaf625e7c5\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"8a355f08-644f-4600-a040-dabaf625e7c5\"><div class=\"bn-block-content\" data-content-type=\"checkListItem\"><input type=\"checkbox\"><p class=\"bn-inline-content\">Todo 2</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"fdf8773a-d17b-4c4b-a79a-ae61c75cef50\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"fdf8773a-d17b-4c4b-a79a-ae61c75cef50\"><div class=\"bn-block-content\" data-content-type=\"checkListItem\"><input type=\"checkbox\"><p class=\"bn-inline-content\">Todo 3</p></div></div></div><div class=\"bn-block-outer\" data-node-type=\"blockOuter\" data-id=\"b17218fc-a365-4680-bc5e-eee8b97c803f\"><div class=\"bn-block\" data-node-type=\"blockContainer\" data-id=\"b17218fc-a365-4680-bc5e-eee8b97c803f\"><div class=\"bn-block-content\" data-content-type=\"paragraph\"><p class=\"bn-inline-content\"></p></div></div></div></div>`;
            const jsonDoc = htmlToJson(htmlDoc || "<p></p>");
            const yjsDoc = jsonToYDoc(jsonDoc);
            // const fragment = yjsDoc.getXmlFragment('default');
            // return fragment;
            const editor = ServerBlockNoteEditor.create();
            const x = await editor.tryParseHTMLToBlocks(htmlDoc)
            // const x = await editor.blocksToYDoc(yjsDoc)
            const y = await editor.blocksToYDoc(x)
            return y;
        } catch (err) {
            data.connection.readOnly = true;
            data.context.error = true;
            sockets[data.socketId].destroy(new Error("close"));
        }
    },
    async onDisconnect(data) {
        console.log("onDisconnect");
        try {
            const page = data.documentName;
            const org = data.context?.orgId;
            if (!data.context.error) {
                const htmlDoc = await getDocHtml(page, org);
                if (htmlDoc) saveRevision(htmlDoc, page, org);
            }
        } catch (error) {
            console.log(error);
        }
    },
    async onDestroy({ instance }) {
        console.log("onDestroy");
    },
});

// module.exports = server;
