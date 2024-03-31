import { Topic } from '@prisma/client';
import { useSession } from 'next-auth/react'
import React, { ReactElement, useState } from 'react'
import { api } from '~/trpc/react';
import NoteEditor from '../../notes/note-editor/note-editor';
import { NoteCard } from '../../notes/note-card/note-card';

export default function Content(): ReactElement {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null); 
  const { data: sessionData } = useSession();

  const { data: topics, refetch } = api.topic.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
    }
  });
  
  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
        void refetch();
    }
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? ""
    }, 
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    });
  
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
        void refetchNotes();
    }
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });



  return (
    <div className='mx-5 mt-5 mb-8 grid grid-cols-4 gap-2'>
        <div className='px-2 flex flex-col gap-4'>
            <ul className='menu rounded-box bg-base-100 p-2 w-full'>
                {topics?.map((topic) => 
                <li key={topic.id}>
                    <a 
                      href='#' 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTopic(topic);
                      }}
                    >
                        {topic.title}
                    </a>
                </li>
                )}
            </ul>
            <input
                type='text'
                placeholder='New Topic'
                className='input-bordered input input-sm w-full'
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        createTopic.mutate({
                            title: e.currentTarget.value,
                        })
                        e.currentTarget.value = "";
                    }
                }}
            />
        </div>
        <div className='col-span-3'>
          <div>
            {notes?.map((note) => (
              <div key={note.id} className="mt-5">
                <NoteCard
                  note={note}
                  onDelete={() => void deleteNote.mutate({ id: note.id })}
                />
              </div>
            ))}
          </div>

          <NoteEditor onSave={({ title, content }: { title: string, content: string }) => {
            void createNote.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? "",
            });
          }} />
        </div>
    </div>
  )
}