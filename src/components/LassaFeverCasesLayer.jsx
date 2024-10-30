import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { User } from 'lucide-react';
import { fetchLassaFeverCases } from '../utils/api';
import { useToast } from './ui/use-toast';

const LassaFeverCasesLayer = ({ map }) => {
  const [cases, setCases] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!map) return;

    const loadCases = async () => {
      try {
        // Use mock data if API fails
        let data;
        try {
          data = await fetchLassaFeverCases();
        } catch (error) {
          console.warn('Failed to fetch real data, using mock data');
          data = [
            {
              id: 1,
              latitude: 9.0820,
              longitude: 8.6753,
              severity: 'high',
              date: new Date().toISOString(),
              location: 'Nigeria'
            }
          ];
        }
        setCases(data);
      } catch (error) {
        console.error('Error in loadCases:', error);
        toast({
          title: "Warning",
          description: "Using mock data due to API unavailability",
          variant: "warning",
        });
      }
    };

    loadCases();
  }, [map, toast]);

  useEffect(() => {
    if (!map || !cases.length) return;

    const markers = cases.map(caseData => {
      const el = document.createElement('div');
      el.className = 'case-marker';
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', caseData.severity === 'high' ? '32' : caseData.severity === 'medium' ? '24' : '20');
      svg.setAttribute('height', caseData.severity === 'high' ? '32' : caseData.severity === 'medium' ? '24' : '20');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', caseData.severity === 'high' ? '#FF3B3B' : caseData.severity === 'medium' ? '#FF8C3B' : '#FFB03B');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 2a2 2 0 0 0-2 2 2 2 0 0 0 2 2c1.1 0 2-.9 2-2s-.9-2-2-2zm-1.5 7.5c1.5 0 3.5.5 3.5 1.5v4.5h-2v6h-3v-6H7V11c0-1 2-1.5 3.5-1.5z');
      svg.appendChild(path);
      el.appendChild(svg);

      el.style.filter = 'drop-shadow(0 0 4px rgba(255, 59, 59, 0.5))';
      
      return new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([caseData.longitude, caseData.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="bg-gray-900/95 p-3 rounded-lg shadow-xl">
                <h3 class="text-red-400 font-bold mb-2">Confirmed Case</h3>
                <div class="space-y-1 text-white">
                  <p><span class="text-red-400">Severity:</span> ${caseData.severity}</p>
                  <p><span class="text-red-400">Date:</span> ${new Date(caseData.date).toLocaleDateString()}</p>
                  <p><span class="text-red-400">Location:</span> ${caseData.location}</p>
                </div>
              </div>
            `)
        )
        .addTo(map);
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, cases]);

  return null;
};

export default LassaFeverCasesLayer;