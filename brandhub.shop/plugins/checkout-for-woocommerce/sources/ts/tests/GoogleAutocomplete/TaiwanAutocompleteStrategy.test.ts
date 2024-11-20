import TaiwanAutocompleteStrategy          from '../../frontend/GoogleAddressAutocomplete/AutocompleteStrategies/TaiwanAutocompleteStrategy';
import { taiwanAddress, taiwanComponents } from './mockData/taiwan';

const strategy = new TaiwanAutocompleteStrategy( taiwanComponents(), taiwanAddress() );

test( 'getAddress1', () => {
    expect( strategy.getAddress1() ).toBe( 'Zhongbu 2nd Street 81號' );
} );

test( 'getAddress2', () => {
    expect( strategy.getAddress2() ).toBe( '' );
} );

test( 'getCity', () => {
    expect( strategy.getCity() ).toBe( 'Taoyuan District' );
} );

test( 'getState', () => {
    expect( strategy.getState() ).toBe( 'Taoyuan City' );
} );

test( 'getPostcode', () => {
    expect( strategy.getPostcode() ).toBe( '330' );
} );

test( 'getCountry', () => {
    expect( strategy.getCountry() ).toBe( 'TW' );
} );
