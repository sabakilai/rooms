import React, {Component} from 'react';

import {
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    WhatsappShareButton, WhatsappIcon
} from 'react-share';

class ShareButtons extends Component {
    render() {
        const {children, pageUrl} = this.props;

        return(
            <div className="share-buttons">
                <p>Поделиться:</p>
                <FacebookShareButton url={pageUrl}>
                    <FacebookIcon size={32} round={true}/>
                    {children}
                </FacebookShareButton>
                <TelegramShareButton url={pageUrl}>
                    <TelegramIcon size={32} round={true}/>
                    {children}
                </TelegramShareButton>
                <WhatsappShareButton url={pageUrl}>
                    <WhatsappIcon size={32} round={true}/>
                    {children}
                </WhatsappShareButton>
            </div>
        )
    }
}

export default ShareButtons;