import { SerializedStyles } from "@emotion/utils"

type EmotionProps<T = unknown> = T & {
    css?: SerializedStyles
}

type DivProps<T = unknown> = T & React.ComponentProps<"div">
type InputProps<T = unknown> = T & React.ComponentProps<"input">
type TextareaProps<T = unknown> = T & React.ComponentProps<"textarea">