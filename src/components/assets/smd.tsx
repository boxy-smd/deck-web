import type { SVGProps } from 'react'

interface SystemsProps extends SVGProps<SVGSVGElement> {
  foregroundColor?: string
  innerColor?: string
}

export function SMD({
  foregroundColor = '#F8FAFC',
  innerColor = '#8B00D0',
  ...props
}: SystemsProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: SVGs are not images and do not need a title
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40ZM5.37872 19.6859C5.07299 19.8286 5.07299 20.2633 5.37872 20.406L12.2914 23.6322L10.5512 29.3C10.4577 29.6047 10.743 29.89 11.0477 29.7965L16.5533 28.106L19.594 34.6213C19.7367 34.927 20.1714 34.927 20.3141 34.6213L23.3485 28.1194L28.8107 29.7965C29.1154 29.89 29.4007 29.6047 29.3072 29.3L27.5732 23.6525L34.5293 20.406C34.8351 20.2633 34.8351 19.8286 34.5293 19.6859L27.7732 16.5329L29.3072 11.5369C29.4007 11.2322 29.1154 10.9469 28.8107 11.0405L23.6526 12.6242L20.3141 5.47067C20.1714 5.16495 19.7367 5.16495 19.594 5.47067L16.2492 12.6375L11.0477 11.0405C10.743 10.9469 10.4577 11.2322 10.5512 11.5369L12.0914 16.5531L5.37872 19.6859Z"
        fill={foregroundColor}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.37872 20.406C5.07299 20.2633 5.07299 19.8286 5.37872 19.6859L12.0914 16.5531L10.5512 11.5369C10.4577 11.2322 10.743 10.9469 11.0477 11.0405L16.2492 12.6375L19.594 5.47067C19.7367 5.16495 20.1714 5.16495 20.3141 5.47067L23.6526 12.6242L28.8107 11.0405C29.1154 10.9469 29.4007 11.2322 29.3072 11.5369L27.7732 16.5329L34.5293 19.6859C34.8351 19.8286 34.8351 20.2633 34.5293 20.406L27.5732 23.6525L29.3072 29.3C29.4007 29.6047 29.1154 29.89 28.8107 29.7965L23.3485 28.1194L20.3141 34.6213C20.1714 34.927 19.7367 34.927 19.594 34.6213L16.5533 28.106L11.0477 29.7965C10.743 29.89 10.4577 29.6047 10.5512 29.3L12.2914 23.6322L5.37872 20.406ZM21.4236 18.6824L20.2644 16.1985C20.1217 15.8928 19.687 15.8928 19.5443 16.1985L18.3851 18.6824C18.3456 18.7669 18.2777 18.8349 18.1931 18.8744L15.7092 20.0336C15.4035 20.1763 15.4035 20.611 15.7092 20.7537L18.1931 21.9129C18.2777 21.9524 18.3456 22.0203 18.3851 22.1049L19.5443 24.5888C19.687 24.8945 20.1217 24.8945 20.2644 24.5888L21.4236 22.1049C21.4631 22.0203 21.5311 21.9524 21.6156 21.9129L24.0995 20.7537C24.4052 20.611 24.4052 20.1763 24.0995 20.0336L21.6156 18.8744C21.5311 18.8349 21.4631 18.7669 21.4236 18.6824Z"
        fill={innerColor}
      />
      <path
        d="M20.2644 16.1985L21.4236 18.6824C21.4631 18.7669 21.5311 18.8349 21.6156 18.8744L24.0995 20.0336C24.4052 20.1763 24.4052 20.611 24.0995 20.7537L21.6156 21.9129C21.5311 21.9524 21.4631 22.0203 21.4236 22.1049L20.2644 24.5888C20.1217 24.8945 19.687 24.8945 19.5443 24.5888L18.3851 22.1049C18.3456 22.0203 18.2777 21.9524 18.1931 21.9129L15.7092 20.7537C15.4035 20.611 15.4035 20.1763 15.7092 20.0336L18.1931 18.8744C18.2777 18.8349 18.3456 18.7669 18.3851 18.6824L19.5443 16.1985C19.687 15.8928 20.1217 15.8928 20.2644 16.1985Z"
        fill={foregroundColor}
      />
    </svg>
  )
}
