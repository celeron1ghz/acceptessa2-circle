import React, { useState, useEffect } from 'react';

import InputPage from '../check/InputPage';
import CompletePage from '../check/CompletePage';
import ErrorPage from '../../component/ErrorPage';

const App: React.FC<{ eid: string }> = ({ eid }) => {
  const [exhibition, setExhibition] = useState<FormValues | Error | null>(null);
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/data/${eid}.json`)
      .then(data => data.json())
      .then(data => setExhibition(data))
      .catch(err => setExhibition(new Error(err)))
  }, []);

  const onSubmit = (mail: string) => {
    fetch("/validate?mail=" + mail)
      .then(data => {
        if (data.ok) {
          setComplete(true);
        } else {
          alert("サーバでエラーが発生しました。時間をおいてもう一度お試しください。");
        }
      });
  };

  if (exhibition == null) {
    return <div>Loading...</div>;
  }

  if (exhibition instanceof Error) {
    return <ErrorPage message="指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。" />
  }

  return (
    <>
      {
        complete
          ? <CompletePage />
          : <InputPage onSubmit={onSubmit} />
      }
    </>
  );
}

export default App;
