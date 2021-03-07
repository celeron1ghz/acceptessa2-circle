import React, { useState, useEffect } from 'react';

import InputPage from '../check/InputPage';
import CompletePage from '../check/CompletePage';
import ErrorPage from '../../component/ErrorPage';
import LoadingPage from '../../component/LoadingPage';

const App: React.FC<{ accessId: string }> = ({ accessId }) => {
  const [exhibitionConfig, setExhibitionConfig] = useState<ExhibitionValues | null>(null);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`/data/${accessId}.json`)
      .then(data => data.json())
      .then(data => setExhibitionConfig(data))
      .catch(err => setError(new Error(err)))
  }, [accessId]);

  if (error) {
    return <ErrorPage message="指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。" />
  }

  if (!exhibitionConfig) {
    return <LoadingPage />;
  }

  const onSubmit = (mail: string) => {
    const eid = exhibitionConfig.exhibition.id;

    fetch(`/validate?mail=${mail}&e=${eid}`)
      .then(data => {
        if (data.ok) {
          setComplete(true);
        } else {
          alert("サーバでエラーが発生しました。時間をおいてもう一度お試しください。");
        }
      });
  };

  return complete
    ? <CompletePage exhibition={exhibitionConfig.exhibition} />
    : <InputPage exhibition={exhibitionConfig.exhibition} onSubmit={onSubmit} />;
}

export default App;
