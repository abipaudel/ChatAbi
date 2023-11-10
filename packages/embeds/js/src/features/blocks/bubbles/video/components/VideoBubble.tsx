import { TypingBubble } from '@/components'
import { isMobile } from '@/utils/isMobileSignal'
import { createSignal, Match, onCleanup, onMount, Switch } from 'solid-js'
import { clsx } from 'clsx'
import {
  defaultVideoBubbleContent,
  embeddableVideoTypes,
  tiktokBaseUrl,
  VideoBubbleContentType,
  vimeoBaseUrl,
  youtubeBaseUrl,
} from '@typebot.io/schemas/features/blocks/bubbles/video/constants'
import {
  EmbeddableVideoBubbleContentType,
  VideoBubbleBlock,
} from '@typebot.io/schemas'

type Props = {
  content: VideoBubbleBlock['content']
  onTransitionEnd: (offsetTop?: number) => void
}

export const showAnimationDuration = 400
let typingTimeout: NodeJS.Timeout

export const VideoBubble = (props: Props) => {
  let ref: HTMLDivElement | undefined
  const [isTyping, setIsTyping] = createSignal(true)

  onMount(() => {
    const typingDuration =
      props.content?.type &&
      embeddableVideoTypes.includes(
        props.content?.type as EmbeddableVideoBubbleContentType
      )
        ? 2000
        : 100
    typingTimeout = setTimeout(() => {
      if (!isTyping()) return
      setIsTyping(false)
      setTimeout(() => {
        props.onTransitionEnd(ref?.offsetTop)
      }, showAnimationDuration)
    }, typingDuration)
  })

  onCleanup(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
  })

  return (
    <div class="flex flex-col w-full animate-fade-in" ref={ref}>
      <div class="flex w-full items-center">
        <div class="flex relative z-10 items-start typebot-host-bubble overflow-hidden w-full max-w-full">
          <div
            class="flex items-center absolute px-4 py-2 bubble-typing z-10 "
            style={{
              width: isTyping() ? '64px' : '100%',
              height: isTyping() ? '32px' : '100%',
              'max-width':
                props.content?.maxWidth ?? defaultVideoBubbleContent.maxWidth,
            }}
          >
            {isTyping() && <TypingBubble />}
          </div>
          <Switch>
            <Match
              when={
                props.content?.type &&
                props.content.type === VideoBubbleContentType.URL
              }
            >
              <video
                autoplay
                src={props.content?.url}
                controls
                class={
                  'p-4 focus:outline-none w-full z-10 text-fade-in rounded-md ' +
                  (isTyping() ? 'opacity-0' : 'opacity-100')
                }
                style={{
                  height: isTyping() ? (isMobile() ? '32px' : '36px') : 'auto',
                  'aspect-ratio': props.content?.aspectRatio,
                  'max-width':
                    props.content?.maxWidth ??
                    defaultVideoBubbleContent.maxWidth,
                }}
              />
            </Match>
            <Match
              when={
                props.content?.type &&
                embeddableVideoTypes.includes(
                  props.content.type as EmbeddableVideoBubbleContentType
                )
              }
            >
              <div
                class={clsx(
                  'p-4 z-10 text-fade-in w-full',
                  isTyping() ? 'opacity-0' : 'opacity-100 p-4'
                )}
                style={{
                  height: isTyping()
                    ? isMobile()
                      ? '32px'
                      : '36px'
                    : !props.content?.aspectRatio
                    ? `${
                        props.content?.height ??
                        defaultVideoBubbleContent.height
                      }px`
                    : undefined,
                  'aspect-ratio': props.content?.aspectRatio,
                  'max-width':
                    props.content?.maxWidth ??
                    defaultVideoBubbleContent.maxWidth,
                }}
              >
                <iframe
                  src={`${getBaseUrl(
                    props.content?.type as EmbeddableVideoBubbleContentType
                  )}/${props.content?.id}`}
                  class={'w-full h-full'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  )
}

const getBaseUrl = (type: EmbeddableVideoBubbleContentType): string => {
  switch (type) {
    case VideoBubbleContentType.VIMEO:
      return vimeoBaseUrl
    case VideoBubbleContentType.YOUTUBE:
      return youtubeBaseUrl
    case VideoBubbleContentType.TIKTOK:
      return tiktokBaseUrl
  }
}
