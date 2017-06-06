import {Component, OnInit} from "@angular/core";
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "./chatMessage";

@Component({
    selector: 'app-chatbox',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {

    public userMessage: string;
    public user: string = "Me";
    public usersList = [];
    public conversation = [];
    public showUserTyping = true;
    public myLastMessage: string;
    private lastTypingSent: string;
    private connection: any;

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.connection = this.chatService.getMessages().subscribe(message => {
            this.processMessage(message);

            if (message['yourName']) this.user = message['yourName'];

            if (this.conversation.length > 2) {
                this.scrollToBottom();
            }
        });
    }

    processMessage(message) {
        switch (message['status']) {
            case "complete": {
                this.addMessage(message);
                break;
            }
            case "typing": {
                if (this.showUserTyping) this.updateUserTypingInfo(message);
                break;
            }
            case "userUpdate": {
                this.usersUpdate(message['users']);
                break;
            }
            default: {
                break;
            }
        }
    }

    updateUserTypingInfo(message) : void {
        if (this.isTypingMessage(message)) {
            if (message['text']) {
                this.conversation.map((msg) => {
                    if (msg.status == 'typing' && msg.sender == message['sender']) {
                        msg.message = message['text'];
                        return false;
                    }
                });
            }
            else {
                this.removeUserTyping(message['sender']);
            }
        }
        else {
            if (message['text']) this.addMessage(message);
        }
    }

    isTypingMessage(message) : boolean {
        return (this.conversation.find((msg) => msg.status == 'typing' && msg.sender == message['sender']));
    }


    removeUserTyping(user) : void {
        let messages = this.conversation.filter((msg)=> {
            return (msg['sender'] != user || msg['status'] != 'typing');
        });

        this.conversation = messages;
    }

    usersUpdate(users) : void {
        this.usersList = users;
    }

    addMessage(message: Object) : void {

        if (message['text'] == this.myLastMessage) {
            this.conversation.push(new ChatMessage(this.user, message['text']));
            this.myLastMessage = '';
            this.removeUserTyping(this.user);
        }
        else {
            this.removeUserTyping(message['sender']);
            this.conversation.push(new ChatMessage(message['sender'], message['text'], message['status']));

        }
    }

    scrollToBottom() : void {
        setTimeout(() => {
            let element = document.getElementById("chatBox");
            element.scrollTop = element.scrollHeight;
        }, 300);
    }

    onKey(event: any) : void {
        if (this.showUserTyping && (this.userMessage || this.lastTypingSent)) {
            this.chatService.sendTypingMessage(this.userMessage);
            this.lastTypingSent = this.userMessage;
            if (!this.userMessage) {
                this.lastTypingSent = "";
            }
        }
    }

    onSubmit() {
        if (this.userMessage) {
            this.myLastMessage = this.userMessage;
            this.chatService.sendMessage(this.userMessage);
            this.userMessage = '';
        }
    }


}
