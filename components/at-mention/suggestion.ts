import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import MentionList from "./MentionList";
import { CustomNodeTypes } from "@/app/constants";

const suggestion = {
  items: ({ query }) => {
    return [
      {
        id: "k3u46gu4bg",
        label: "LangChain OpenAI Functions Webinar",
        type: CustomNodeTypes.YOUTUBE,
      },
      {
        id: "blala",
        label: "LangChain SQL Webinar",
        type: CustomNodeTypes.YOUTUBE,
      },
      {
        id: "2",
        label: "OpenAI Notes",
        type: CustomNodeTypes.NOTE,
      },
    ]
      .filter((item) =>
        item.label.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default suggestion;
