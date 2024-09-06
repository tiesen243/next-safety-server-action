import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

import { getBaseUrl } from '@/lib/utils'
import { seo } from '@/lib/seo'

interface Props {
  params: {
    title?: string
    desc?: string
  }
}

export const runtime = 'edge'

export const GET = async (_: NextRequest, { params }: Props): Promise<ImageResponse> => {
  const title = params.title ?? seo({}).applicationName!
  const description = params.desc ?? seo({}).description!

  const style = {
    width: '30%',
    marginRight: '2rem',
    filter: 'invert(1)',
    WebkitFilter: 'invert(1)',
  }

  return new ImageResponse(
    (
      <div tw="relative w-full h-full px-28 flex flex-col items-center justify-center bg-black text-white">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img alt={seo({}).applicationName!} src={`${getBaseUrl()}/logo.svg`} style={style} />
        <h2 tw="my-8 text-4xl capitalize">{title}</h2>
        <p tw="text-xl">{description}</p>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
