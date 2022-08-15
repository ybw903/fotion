import { IoCreate } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./MarkDownViewer.css";

const MarkDownViewr = ({
  markdown,
  editMode,
  handleChangeEditMode,
  handleSaveDocs,
}: {
  markdown: string;
  editMode: boolean;
  handleChangeEditMode: () => void;
  handleSaveDocs: () => void;
}) => {
  return (
    <div style={{ padding: "20px" }}>
      <div className="MarkDownViewrHeader">
        <div
          className="MarkDownEditBtn"
          onClick={() =>
            !editMode ? handleChangeEditMode() : handleSaveDocs()
          }
        >
          <IoCreate size={28} />
          {!editMode ? "수정" : "저장"}
        </div>
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                PreTag="div"
                // {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDownViewr;
