import React from "react";

const MessageBox = (props: any) => {
    console.log(props);

    return (
        <div>
            hello {props.name}
        </div>
    );
};

export default MessageBox;