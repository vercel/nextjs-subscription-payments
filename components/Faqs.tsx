import { Container } from '@/components/Container'

const faqs = [
  [
    {
      question: 'How do I know the tips are good?',
      answer:
        'Our whole business depends on our tips being good, so it’s in our best interest that they are. The results of our customers speak for themselves, just trust us.',
    },
    {
      question: 'Isn’t this insider trading?',
      answer:
        'Yes exactly. But at scale! Historically you could only make insider trades with knowledge from your direct network. Pocket brings you insider trading tips from people you don’t even know.',
    },
    {
      question: 'But isn’t insider trading illegal?',
      answer:
        'Here’s the thing: you’re the one doing the insider trading, not us. We’re just giving you the tips and some tools to make trades. We’re not doing anything wrong here.',
    },
  ],
  [
    {
      question: 'Do the people giving you tips realize what they are doing?',
      answer:
        'Again I would argue this isn’t really our responsibility. People make their own choices. If they don’t research the consequences that’s on them, not on us.',
    },
    {
      question: 'Where is Pocket based?',
      answer:
        'Let’s just say it’s not somewhere where the SEC is going to find us.',
    },
    {
      question: 'Is there any age limit to trading on Pocket?',
      answer:
        'For our free plan, the age limit is based on the minimum age to trade in your country of residence. Our VIP plan uses advanced transaction anonymization though, so you can use that plan even if you’re 9 years old. Or a dog.',
    },
  ],
  [
    {
      question: 'How did you get this on the App Store?',
      answer:
        'Honestly we were surprised too, but eventually we found out that the app reviewer found the app so compelling they approved it just so they could use it themselves.',
    },
    {
      question: 'How do I explain the money I withdraw from Pocket to the IRS?',
      answer:
        'This feels like one-hundred percent a you problem. Pocket is not responsible in any way for your tax returns.',
    },
    {
      question: 'How do I become an insider?',
      answer:
        'Contact us with some details about your industry and the type of access you have to apply for an insider account. Once approved, we’ll send you a guide on collecting insider information without being detected at work.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            If you have anything else you want to ask,{' '}
            <a
              href="mailto:info@example.com"
              className="text-gray-900 underline"
            >
              reach out to us
            </a>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
