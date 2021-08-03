import { Div, Icon, Text } from '../../../theme/components';
import { FilterButton } from '../components/FilterButton';
import { FilterList } from '../components/FilterList';
import { String } from '../../String/String';
import { multipleItemString } from '../../../helpers/multipleItemString';
import { sortBy } from 'lodash';
import { useTranslation } from '../../TranslationProvider/TranslationProvider';
import Api from '../../../apis/api';
import React, { ChangeEvent, useEffect, useState } from 'react';
import countriesJson from '../../../constants/countries.json';

const countriesCollection: { [key: string]: any } = countriesJson;

type CountryFilterFieldProps = {
    handleChange: Function;
    defaultValue: string;
};

export const CountryFilterField = (props: CountryFilterFieldProps) => {
    const { defaultValue, handleChange: handleChangeFromProps } = props;

    const [searchString, setSearchString] = useState('');
    const [countries, setCountries] = useState([]);
    const [selected, setSelected] = useState(multipleItemString.parse(defaultValue) || []);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const getCountries = async () => {
            const countriesArr = await Api.getCommunityCount('country');
            const unsortedCountries = countriesArr.map(
                ({ country: code, count }: { count?: number | string; country: string }) => ({
                    count,
                    label: countriesCollection[code]?.name,
                    value: code
                })
            );

            const countries = sortBy(unsortedCountries, ['name', 'code']);

            setCountries(countries);
        };

        getCountries();
    }, []);

    useEffect(() => {
        const filteredCountries = (countries || []).filter(
            ({ label, value }) =>
                label.toLowerCase().includes(searchString.toLocaleLowerCase()) ||
                value.toLowerCase().includes(searchString.toLocaleLowerCase())
        );

        setFilteredCountries(searchString ? filteredCountries : countries);
    }, [searchString, countries]);

    const handleSearchFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event?.target?.value;

        setSearchString(value);
    };

    const handleChange = (items: string[]) => {
        setSelected(items);
        handleChangeFromProps(!!items?.length ? multipleItemString.stringify(items) : '');
    };

    return (
        <FilterButton
            flyoutProps={{ small: true }}
            label={
                <Div>
                    <Icon icon="world" sWidth={1} textSecondary />
                    <Text left medium ml={0.625} sWidth="100%" small textPrimary>
                        {!!selected?.length ? (
                            <>
                                {selected?.length} <String id="selected" />
                            </>
                        ) : (
                            <String id="allCountries" />
                        )}
                    </Text>
                    <Icon icon="caret" ml={0.625} sWidth={0.7} textSecondary />
                </Div>
            }
        >
            {!!countries?.length && (
                <FilterList
                    defaultValue={multipleItemString.parse(defaultValue)}
                    handleChange={handleChange}
                    handleSearch={handleSearchFieldChange}
                    isResetable
                    isSelectable
                    items={filteredCountries}
                    searchPlaceholder={t('searchByCountry')}
                    withCounter
                />
            )}
        </FilterButton>
    );
};