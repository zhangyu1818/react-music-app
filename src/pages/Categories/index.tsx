import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import request from '../../utils/request';
import SimpleHeader from '../../components/SimpleHeader';

const Categories = (props: {
  className?: string;
  onChange?: (cat: string) => void;
  history: any;
  cat?: string;
}) => {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [active, setActive] = useState(props.cat || '');
  useEffect(() => {
    request('/playlist/catlist').then(({ categories, sub }) => {
      const categoriesList = Object.values(categories).map((title, index) => ({
        title,
        list: sub.filter((item: any) => item.category === index)
      }));
      setCategoriesList(categoriesList);
    });
  }, []);
  const clickTag = (active: string) => {
    setActive(active);
  };
  return (
    <div className={classNames(styles.categories, props.className)}>
      <div className={styles.content}>
        <SimpleHeader
          title={'选择分类'}
          onClickBack={() => {
            props.history.goBack();
            if (props.onChange) props.onChange(active);
          }}
        />
        <div className={styles.categoriesList}>
          <div
            className={classNames(styles.all, {
              [styles.active]: active === '全部歌单'
            })}
            onClick={() => clickTag('全部歌单')}
          >
            全部歌单
          </div>
          {categoriesList.map((item) => (
            <dl key={item.title}>
              <dt>{item.title}</dt>
              {item.list.map((sub: any) => (
                <dd
                  key={sub.name}
                  onClick={() => clickTag(sub.name)}
                  className={active === sub.name ? styles.active : undefined}
                >
                  {sub.name}
                </dd>
              ))}
            </dl>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
