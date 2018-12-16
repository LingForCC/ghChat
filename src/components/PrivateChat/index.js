import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import InputArea from '../InputArea';
import ChatContentList from '../ChatContentList';

export default class PrivateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatLength: 0
    };
  }

    sendMessage = (value) => {
      if (value.trim() === '') return;
      const fromUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const {
        allChatContent, chatId, homePageList, updateHomePageList, updateAllChatContentBySent
      } = this.props;
      const { userInfo } = allChatContent.privateChat.get(chatId);
      const data = {
        from_user: fromUserInfo.user_id, // 自己的id
        to_user: userInfo.user_id, // 对方id
        avator: fromUserInfo.avator, // 自己的头像
        name: fromUserInfo.name,
        message: `${fromUserInfo.name}: ${value}`, // 消息内容
        type: 'private',
        status: '1', // 是否在线 0为不在线 1为在线
        time: Date.parse(new Date()) / 1000 // 时间
      };
      socket.emit('sendPrivateMsg', data);
      updateAllChatContentBySent({ allChatContent, newChatContent: data, chatType: 'privateChat' });
      updateHomePageList({ data, homePageList, myUserId: fromUserInfo.user_id });
      console.log('sent message', data);
    }

    scrollToBottom(time = 0) {
      const ulDom = document.getElementsByClassName('chat-content-list')[0];
      setTimeout(() => {
        ulDom.scrollTop = ulDom.scrollHeight + 10000;
      }, time);
    }

    componentDidMount() {
      // const { chatId, allChatContent } = this.props;
      // console.log('componentDidUpdate in privateChat', allChatContent.privateChat, chatId);
      // const { privateDetail, userInfo } = allChatContent && allChatContent.privateChat && allChatContent.privateChat.get(chatId);
      // console.log('before state length', this.state.chatLength);
      // this.setState({ chatLength: privateDetail.length });
      // console.log('after state length', this.state.chatLength);
      this.scrollToBottom();
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps in privateChat', nextProps, this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { relatedCurrentChat, chatId } = nextProps;
      if (relatedCurrentChat || chatId !== this.props.chatId) return true;
      return false;
    }

    componentDidUpdate() {
      console.log('componentDidUpdate in privateChat');
      this.scrollToBottom();
    }

    componentWillUnmount() {
      console.log('componentWillUnmount in privateChat');
    }

    render() {
      const { chatId, allChatContent } = this.props;
      console.log('allChatContent.privateChat', allChatContent.privateChat, chatId);
      if (!allChatContent.privateChat) return null;
      const { privateDetail, userInfo } = allChatContent.privateChat.get(chatId);
      return (
        <div className="chat-wrapper">
          <ChatHeader title={userInfo.name} />
          <ChatContentList ChatContent={privateDetail} chatId={chatId} />
          <InputArea sendMessage={this.sendMessage} />
        </div>
      );
    }
}

PrivateChat.propTypes = {
  allChatContent: PropTypes.object,
  homePageList: PropTypes.array,
  updateHomePageList: PropTypes.func,
  updateAllChatContentBySent: PropTypes.func,
  chatId: PropTypes.number
};


PrivateChat.defaultProps = {
  allChatContent: {},
  homePageList: [],
  updateHomePageList: undefined,
  updateAllChatContentBySent: undefined,
  chatId: undefined,
};