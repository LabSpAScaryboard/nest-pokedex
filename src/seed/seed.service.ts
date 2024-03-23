import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}


  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    
    data.results.forEach(({ name, url }) => { // De esta forma se agregan individualmente a la base de datos
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      //const pokemon = await this.pokemonModel.create( {name, no} )
      pokemonToInsert.push({name,no}); // Arreglo de pokemones
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return 'Seed Executed';
  }


  // VERSION SUBIDA INIDIVIDUAL
  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({});

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   const insertPromisesArray = [];

    
  //   data.results.forEach( ({ name, url }) => { // De esta forma se agregan individualmente a la base de datos
  //                                             // No es eficiente en lotes de información 

  //     const segments = url.split('/');
  //     const no = +segments[ segments.length - 2 ];


  //     //const pokemon = await this.pokemonModel.create( {name, no} )

  //     insertPromisesArray.push(
  //       this.pokemonModel.create({name,no})
  //     )
  //   });

  //   const newArray = await Promise.all(insertPromisesArray);
    
  //   return 'Seed Executed';
  // }

}
