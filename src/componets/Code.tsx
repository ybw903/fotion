import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-bash.min";
import "prismjs/components/prism-typescript.min";
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-markup-templating.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-css.min";
import "prismjs/components/prism-python.min";
import "prismjs/components/prism-go.min";
import "prismjs/components/prism-scss.min";
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-c.min";
import "prismjs/components/prism-cpp.min";
import "prismjs/components/prism-csharp.min";
import "prismjs/components/prism-graphql.min";
import "prismjs/components/prism-tsx.min";
import "prismjs/components/prism-php.min";
import "prismjs/components/prism-aspnet.min";
import "prismjs/components/prism-sql.min";
import "prismjs/components/prism-swift.min";
import "prismjs/components/prism-kotlin.min";
import "prismjs/components/prism-erlang.min";
import "prismjs/components/prism-elixir.min";
import "prismjs/components/prism-ruby.min";
import "prismjs/components/prism-rust.min";
import "prismjs/components/prism-yaml.min";
import "prismjs/components/prism-dart";

const Code = ({ code, language }: { code: string; language: string }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div className="code">
      <pre>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </pre>
    </div>
  );
};

export default Code;
