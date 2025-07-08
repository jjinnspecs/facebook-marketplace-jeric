'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { categories } from '@/lib/categories';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';


const ListingSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'Price must be greater than zero' }),
  category: z.string().min(1, 'Please select a category'),
  seller_email: z.string().email('Enter a valid email'),
  image: z.any().refine((files) => files?.length > 0, 'At least one image is required'),
  location: z.string().optional(),
});

type ListingFormData = z.infer<typeof ListingSchema>;

export default function ListingForm() {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formattedPrice, setFormattedPrice] = useState('0.00');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(ListingSchema),
    defaultValues: {
      price: 0.00,
    },
  });

  const watchFields = watch();


  useEffect(() => {
    const price = watchFields.price;
    if (typeof price === 'number' && !isNaN(price)) {
      setFormattedPrice(price.toFixed(2));
    } else {
      setFormattedPrice('0.00');
    }
  }, [watchFields.price]);


  // Handles form submission
  const onSubmit = async (data: ListingFormData) => {
    const files: File[] = Array.from(data.image || []);
    const image_urls: string[] = [];

    // Image Upload to Supabase Storage
    for (const file of files) {
      const { data: uploadData, error } = await supabase.storage
        .from('listing-images')
        .upload(`public/${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error || !uploadData) {
        toast.error(`Failed to upload ${file.name}. Error: ${error?.message || 'Unknown error'}`);
        return;
      }

      const { publicUrl } = supabase.storage
        .from('listing-images')
        .getPublicUrl(uploadData.path).data;

      image_urls.push(publicUrl);
    }

    // Insert listing data into Supabase database
    const { error: insertError } = await supabase.from('listings').insert([{
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      seller_email: data.seller_email,
      image_url: JSON.stringify(image_urls),
      location: data.location || 'Manila, Philippines',
    }]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      toast.error('Failed to create listing. Please try again.');
    } else {
      toast.success('Listing created successfully!');
      reset();
      setImagePreview([]);
      setCurrentIndex(0);
      setFormattedPrice('0.00'); 
    }
  };


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) =>
        prev === imagePreview.length - 1 ? 0 : prev + 1
      ),
    onSwipedRight: () =>
      setCurrentIndex((prev) =>
        prev === 0 ? imagePreview.length - 1 : prev - 1
      ),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-800 mb-2">
              Upload photo
            </label>
            <div
              className={`relative w-full border-2 border-dashed rounded-lg p-4 flex items-center justify-center text-center cursor-pointer transition aspect-video ${ // Added aspect-video for consistent height
                imagePreview.length > 0
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                {...register('image')}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    const previews = files.map((file) => URL.createObjectURL(file));
                    setImagePreview(previews);
                    setCurrentIndex(0);
                  } else {
                    setImagePreview([]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto z-0 p-2">
                  {imagePreview.map((src, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <Image
                        fill
                        src={src}
                        alt={`Preview ${i}`}
                        className="h-full max-h-40 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedPreviews = imagePreview.filter((_, idx) => idx !== i);
                          setImagePreview(updatedPreviews);
                          const dataTransfer = new DataTransfer();
                          const currentFiles = Array.from(watchFields.image || []);
                          currentFiles.filter((_, idx) => idx !== i).forEach(file => dataTransfer.items.add(file as File));
                          setValue('image', dataTransfer.files as FileList, { shouldValidate: true });
                          setCurrentIndex(0);
                        }}
                        className="absolute top-0 right-0 z-20 text-red-500 hover:text-red-700 bg-white bg-opacity-75 rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none cursor-pointer"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 z-0">Click to upload or drag a photo</p>
              )}
            </div>
            {typeof errors.image?.message === 'string' && (
              <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              placeholder="What are you selling?"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="0.00"
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  const fixed = isNaN(val) ? '0.00' : val.toFixed(2);
                  setValue('price', parseFloat(fixed), { shouldValidate: true });
                  e.target.value = fixed; // Update input's displayed value to fixed format
                }}
                className="w-full border rounded pl-7 pr-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="seller_email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input
              id="seller_email"
              type="email"
              {...register('seller_email')}
              placeholder="example@email.com"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.seller_email && (
              <p className="text-sm text-red-500 mt-1">{errors.seller_email.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              placeholder="Give some details..."
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              id="location"
              type="text"
              {...register('location')}
              placeholder="Manila, Philippines"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              {...register('category')}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories
                .filter((cat) => cat !== "Today's Picks")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>

        {/* RIGHT COLUMN: Preview */}
        <div {...swipeHandlers} className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 space-y-4 w-full">
          {/* Image carousel */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {imagePreview.length > 0 ? (
              <>
                <Image
                  fill
                  src={imagePreview[currentIndex]}
                  alt={`Preview ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {imagePreview.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex((prev) =>
                          prev === 0 ? imagePreview.length - 1 : prev - 1
                        )
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-700 shadow hover:bg-white transition z-10"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex((prev) =>
                          prev === imagePreview.length - 1 ? 0 : prev + 1
                        )
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-700 shadow hover:bg-white transition z-10"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {imagePreview.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No image selected.
              </div>
            )}
          </div>

          {/* Preview text */}
          <div className="text-sm space-y-2">
            <h2 className="font-bold text-lg">{watchFields.title || 'Listing Title'}</h2>
            <p className="text-blue-600 font-bold text-md">
              ₱
              {Number(formattedPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <p className="text-xs text-gray-500">
              Listed just now<br />
              in {watchFields.location || 'Manila, Philippines'}
            </p>
            <p className="mt-4 text-xs">
              <strong>Seller:</strong><br />
              {watchFields.seller_email || 'example@email.com'}
            </p>
            <p className="mt-4 text-xs text-gray-800">
              <strong>Description:</strong><br />
              {watchFields.description || 'No description provided yet.'}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}