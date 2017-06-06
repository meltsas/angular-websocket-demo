
export class ChatMessage {
  status: string;
  sender: string;
  message: string;
  timeStamp: string;

  constructor(sender, message, status="complete") {
    this.sender = sender;
    this.message = message;
    this.timeStamp = this.getTimestamp();
    this.status = status;
  }

  getTimestamp() {
    let date = new Date();
    // console.log(JSON.stringify(date));
    let timestamp = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2) + ' ' +
      ('00' + date.getHours()).slice(-2) + ':' +
      ('00' + date.getMinutes()).slice(-2) + ':' +
      ('00' + date.getSeconds()).slice(-2);
    return timestamp;
  }


}
