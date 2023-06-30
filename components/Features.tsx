'use client';

export default function Features() {
    return (
        <section id="features" className="max-w-6xl mx-auto flex md:flex-row md:justify-between flex-col sm:py-16 py-6">
            <div className="flex  justify-center items-start flex-col max-w-[540px]">
                <h1 className="text-4xl font-extrabold text-white sm:text-left sm:text-6xl">
                    It take cares of the whole process
                </h1>
                <p className="text-xl text-zinc-200 sm:text-2xl max-w-[470px] mt-5">
                    Just set your parameters and launch it.
                </p>
            </div>
        
            <div className='flex justify-center items-start md:ml-10 ml-0 md:mt-0 mt-10 relative flex-col'>
                <FeatureCard
                    title="Automatic Download"
                    content={[
                        "to Tiktok",
                        "to Youtube",
                        "to Reddit",
                    ]}
                />
                <FeatureCard
                    title="Automatic Edit"
                    content={[
                        "Background Effects",
                        "Side Text",
                        "Subscription Reminder",
                    ]}
                />
                <FeatureCard
                    title="Automatic Upload"
                    content={[
                        "Automatic Thumbnail Generation",
                        "Auto Login",
                        "Auto Upload",
                    ]}
                />
            </div>
        </section>
    );
};

interface Props {
    title: string;
    content: string[];
}

const FeatureCard = ({ title, content }: Props) => (
    <div className='flex flex-row p-6 rounded-[20px] feature-card'>

      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-semibold text-xl text-zinc-200 sm:text-2xl leading-[23.4px] mb-1">
          {title}
        </h4>
        {content.map(item => (
            <div className="flex flex-row items-center">
                <div className='w-[34px] h-[34px] rounded-full flex justify-center items-center bg-[rgba(9, 151, 124, 0.1)]'>
                    <img src="/star.svg" alt="star" className="w-[50%] h-[50%] object-contain" />
                </div>
                <p key={`${item}123456`} className="font-semibold text-xl text-zinc-200 sm:text-2xl">
                    {item}
                </p>
            </div>
        ))}
        <p className="text-xl text-zinc-500 sm:text-2xl">
            ...and more
        </p>
      </div>
    </div>
);