import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadDocument } from '../../services/api';

interface ApplicationFormProps {
  vehicleId: number;
  type: 'sale' | 'rental';
  onSubmit: (data: any) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ vehicleId, type, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicleId', vehicleId.toString());

    try {
      await uploadDocument(formData);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dossier de {type === 'sale' ? 'Financement' : 'Location'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('fullName', { required: true })}
              placeholder="Nom complet"
            />
            {errors.fullName && <span className="text-red-500">Ce champ est requis</span>}
          </div>

          <div>
            <Input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              type="email"
              placeholder="Email"
            />
            {errors.email && <span className="text-red-500">Email invalide</span>}
          </div>

          <div>
            <Input
              {...register('phone', { required: true })}
              placeholder="Téléphone"
            />
            {errors.phone && <span className="text-red-500">Ce champ est requis</span>}
          </div>

          <div>
            <Input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>

          <Button type="submit" className="w-full">
            Soumettre le dossier
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};