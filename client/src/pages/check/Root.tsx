import React, { useState } from 'react';

import InputPage from '../check/InputPage';
import CompletePage from '../check/CompletePage';

const App: React.FC<{ eid: string }> = ({ eid }) => {
  const [complete, setComplete] = useState<boolean>(false);

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
