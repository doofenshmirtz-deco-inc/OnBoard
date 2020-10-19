import React from "react";
import { Backup } from "@material-ui/icons";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react/hooks/useMutation";
import { SingleUpload } from "../../graphql/SingleUpload";
import { useMessaging } from "../../hooks/useMessaging";

const UPLOAD_FILE = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file)
  }
`;

const UploadTest = () => {
  const [upload, { data }] = useMutation<SingleUpload>(UPLOAD_FILE);

  const url = data?.singleUpload;

  const uploadCallback = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target?.files?.[0];
    console.log(file);
    if (file) upload({ variables: { file } });
  };

  return (
    <div>
      <form encType="multipart/form-data">
        <input type="file" onChange={uploadCallback} multiple={false} />
      </form>
      {url && (
        <div>
          Uploaded to:{" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
};

export default {
  routeProps: {
    path: "/upload-test",
    component: UploadTest,
  },
  name: "Upload Test",
  icon: Backup,
};
