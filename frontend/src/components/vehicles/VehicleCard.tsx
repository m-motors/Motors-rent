import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <img
          src={vehicle.images?.[0] || "/api/placeholder/400/300"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{vehicle.brand} {vehicle.model}</h3>
          <p className="text-gray-600">{vehicle.price.toLocaleString()} €</p>
          <p className="text-sm text-gray-500">{vehicle.mileage} km - {vehicle.year}</p>
          <Button
            className="mt-4 w-full"
            onClick={() => onSelect(vehicle)}
          >
            {vehicle.type === 'sale' ? 'Voir détails' : 'Réserver'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};