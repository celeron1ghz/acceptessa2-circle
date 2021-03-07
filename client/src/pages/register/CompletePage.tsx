import React from 'react';
import { Alert, Button, Col } from 'react-bootstrap';
import { HandThumbsUpFill, Twitter, ImageFill } from 'react-bootstrap-icons';

const TweetButton: React.FC<{
  exhibition: Exhibition,
  label: string,
  message: string,
}> = ({
  exhibition,
  label,
  message,
}) => {
    const tweet = `${exhibition.exhibition_name} に申し込みしました！`;
    const p = new window.URLSearchParams();
    p.append("text", tweet);
    p.append("url", "https://google.co.jp/");
    p.append("hashtags", "moge,piyo");

    return (
      <Button
        className="my-3"
        size="lg"
        style={{ backgroundColor: "#1DA1F2", border: "0px" }}
        href={"https://twitter.com/intent/tweet?" + p.toString()}
        target="_blank"
      >
        <Twitter /> {label}
      </Button>
    )
  };

const CompletePage: React.FC<{ exhibition: Exhibition }> = ({ exhibition }) => {
  console.log(exhibition)
  return <>
    <Alert className="text-center my-3" variant="light" >
      <HandThumbsUpFill /> サークルの登録が完了しました<br />
      登録内容の確認メールを送付しましたので内容をご確認ください。<br />
    </Alert>

    <Col className="text-center text-info my-3">
      よろしければTwitterのフォロワーに申込したことをお伝え下さい！<br />
      下記ボタンを押すとTweetするウインドウを別ウインドウで開きます。<br />
      <TweetButton exhibition={exhibition} message="aaa" label="ツイートする" />
    </Col>

    <Col className="text-center text-success my-3">
      引き続きサークルカットの登録を行ってください。<br />
      後でサークルカットの登録・差し替えを行うことも可能です。<br />
      登録内容の確認メールにリンクが記載されています。<br />
      <Button className="my-3" variant="success">
        <ImageFill /> サークルカットのアップロードページへ
      </Button>
    </Col>
  </>;
};

export default CompletePage;