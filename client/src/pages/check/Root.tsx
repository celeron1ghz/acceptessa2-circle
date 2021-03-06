import React, { useState, useEffect } from 'react';

import InputPage from '../check/InputPage';
import CompletePage from '../check/CompletePage';
import ErrorPage from '../../component/ErrorPage';
import LoadingPage from '../../component/LoadingPage';

const App: React.FC<{ eid: string }> = ({ eid }) => {
  const [exhibitionConfig, setExhibitionConfig] = useState<ExhibitionValues>({});
  const [complete, setComplete] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/data/${eid}.json`)
      .then(data => data.json())
      .then(data => setExhibitionConfig({ ...data, loaded: true }))
      .catch(err => setExhibitionConfig({ error: new Error(err), loaded: true }))
  }, [eid]);

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

  if (!exhibitionConfig.loaded) {
    return <LoadingPage />;
  }

  if (exhibitionConfig.error) {
    return <ErrorPage message="指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。" />
  }

  return complete
    ? <CompletePage />
    : <InputPage onSubmit={onSubmit} />;
}

export default App;
