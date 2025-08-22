import { toast } from 'sonner';
import { useState } from 'react';
import useErrorStore from '../store/errorStore.js';
import api from '../api/axios';

export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError } = useErrorStore();

  const handleSubmit = async ({
    e,
    isEdit,
    url,
    formData,
    onSuccess,
    onReset,
  }) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await (isEdit
        ? api.put(url, formData)
        : api.post(url, formData));

      const data = res.data;

      if (data) {
        toast.success(data.message);
        onSuccess?.();
        onReset?.();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          setError(data.errors || data.message);
        } else if (status === 429) {
          toast.error(`${data.message} Try again in a moment.`);
        } else {
          toast.error(data.message || 'Something went wrong.');
        }
      } else {
        toast.error('Network error or server not responding.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, error, setError };
}
