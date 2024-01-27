import Head from 'next/head'
import React from 'react'

export const SocialMetaTags = ({
  title = 'Flowdacity - AI Chatbot Generator for Conversational Experiences',
  description = 'Powerful blocks to create unique chat experiences. Embed them anywhere on your apps and start collecting results like magic.',
  currentUrl,
  imagePreviewUrl = 'https://flowdacity.sirv.com/web/og.png',
}: {
  title?: string
  description?: string
  currentUrl: string
  imagePreviewUrl?: string
}) => (
  <Head>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta property="og:title" content={title} />
    <meta property="twitter:title" content={title} />

    <meta property="twitter:url" content={currentUrl} />
    <meta property="og:url" content={currentUrl} />

    <meta name="description" content={description} />
    <meta property="twitter:description" content={description} />
    <meta property="og:description" content={description} />

    <meta property="og:image" content={imagePreviewUrl} />
    <meta property="twitter:image" content={imagePreviewUrl} />

    <meta property="og:type" content="website" />
    <meta property="twitter:card" content="summary_large_image" />

    <meta property="fb:app_id" content="395073329554179" />
  </Head>
)
