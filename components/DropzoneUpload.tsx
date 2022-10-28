import { Component, FormEvent, useEffect, useRef, useState } from 'react';
import { Text, Image, SimpleGrid, FileInput } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import Button from '@/components/ui/Button';
import axios from 'axios';

const DropzoneUpload = () => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (dropzoneRef && dropzoneRef.current) {
      dropzoneRef.current.focus();
    }
    if (formRef && formRef.current) {
      formRef.current.focus();
    }
  }, [dropzoneRef, dropzoneRef.current, formRef, formRef.current]);

  const uploadFiles = async (event: any) => {
    event.preventDefault();

    const formElem = formRef.current as HTMLFormElement;
    if (!formElem) {
      return;
    }
    const formData = new FormData(formElem);
    formData.delete("files");
    files.forEach( (f) => {
      const nativeFile = f as File;
      formData.append("files", nativeFile);
    })
    console.log("Getallfiles:", formData.getAll("files"));

    //fetch("/api/upload", method: "POST", { data: formData });
    const res = await axios.postForm("/api/upload", formData);
    console.log(res);


    return true;
  }

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

    return (
      <div>

        <form ref={formRef} method="post" onSubmit={ async (e) => { await uploadFiles(e) } } encType="multipart/form-data">
          <FileInput name="files" id="files" label="Upload files" placeholder="Upload files" value={(files as File[])} multiple
                     hidden />
          <Dropzone accept={IMAGE_MIME_TYPE} onDrop={(files) => {
            setFiles(files);
          }}>
            <Text align="center">Drop images here</Text>
          </Dropzone>
          c
          <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
            mt={previews.length > 0 ? 'xl' : 0}
          >
            {previews}
          </SimpleGrid>

          <Button

            variant="slim"
            type="submit"
            disabled={false}
            loading={false}
            className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-zinc-900"
          >
            Upload!
          </Button>

        </form>













        <div>
          <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
            Brought to you by
          </p>
          <div
            className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
            <div className="flex items-center justify-start">
              <a href="https://nextjs.org" aria-label="Next.js Link">
                <img
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  className="h-12 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://vercel.com" aria-label="Vercel.com Link">
                <img
                  src="/vercel.svg"
                  alt="Vercel.com Logo"
                  className="h-6 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://stripe.com" aria-label="stripe.com Link">
                <img
                  src="/stripe.svg"
                  alt="stripe.com Logo"
                  className="h-12 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://supabase.io" aria-label="supabase.io Link">
                <img
                  src="/supabase.svg"
                  alt="supabase.io Logo"
                  className="h-10 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://github.com" aria-label="github.com Link">
                <img
                  src="/github.svg"
                  alt="github.com Logo"
                  className="h-8 text-white"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

    );
}

export default DropzoneUpload;